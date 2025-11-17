from manim import *
import numpy as np

class WheatChessboardExponential(Scene):
    def construct(self):
        # Title scene
        title = Text("The Wheat & Chessboard", font_size=48)
        subtitle = Text("A Tale of Exponential Growth", font_size=32, color=GOLD)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))

        # Story introduction
        story_text = VGroup(
            Text("A clever mathematician asked the king for a reward:", font_size=24),
            Text("One grain of wheat on the first square,", font_size=24, color=YELLOW),
            Text("Two grains on the second,", font_size=24, color=YELLOW),
            Text("Four on the third...", font_size=24, color=YELLOW),
            Text("Doubling each time.", font_size=24, color=GOLD)
        ).arrange(DOWN, buff=0.3)
        story_text.shift(UP * 1)
        
        for line in story_text:
            self.play(Write(line), run_time=0.8)
        self.wait(2)
        self.play(FadeOut(story_text))

        # Create a simplified chessboard (8x8)
        board_size = 4  # Start with smaller visible portion
        square_size = 0.6
        
        def create_chessboard(size=8, square_size=0.6, show_all=True):
            board = VGroup()
            for i in range(size):
                for j in range(size if show_all else min(4, size)):
                    color = BLACK if (i + j) % 2 == 0 else WHITE
                    square = Square(side_length=square_size, 
                                  fill_color=color, 
                                  fill_opacity=0.7,
                                  stroke_color=GREY,
                                  stroke_width=1)
                    square.shift(RIGHT * (j - size/2 + 0.5) * square_size + 
                               UP * (i - size/2 + 0.5) * square_size)
                    board.add(square)
            return board
        
        # Create initial small board
        board = create_chessboard(4, square_size, show_all=True)
        board.shift(LEFT * 3)
        self.play(Create(board))
        
        # Create grain counter and power display
        grain_label = Text("Grains:", font_size=24)
        grain_count = Text("0", font_size=32, color=YELLOW)
        grain_display = VGroup(grain_label, grain_count).arrange(RIGHT, buff=0.3)
        grain_display.to_edge(UP).shift(RIGHT * 3)
        
        square_label = Text("Square:", font_size=24)
        square_num = Text("0", font_size=32, color=BLUE)
        square_display = VGroup(square_label, square_num).arrange(RIGHT, buff=0.3)
        square_display.next_to(grain_display, DOWN, buff=0.5)
        
        power_label = Text("Power:", font_size=24)
        power_text = Text("2⁰ = 1", font_size=28, color=GREEN)
        power_display = VGroup(power_label, power_text).arrange(RIGHT, buff=0.3)
        power_display.next_to(square_display, DOWN, buff=0.5)
        
        self.play(
            Write(grain_display),
            Write(square_display),
            Write(power_display)
        )
        
        # Function to create wheat grain representation
        def create_grain_pile(count, max_display=1000):
            if count <= 10:
                # Show individual grains
                grains = VGroup()
                positions = []
                for i in range(int(count)):
                    angle = i * 2 * PI / count
                    pos = 0.2 * np.array([np.cos(angle), np.sin(angle), 0])
                    grain = Dot(radius=0.05, color=GOLD)
                    grain.shift(pos)
                    grains.add(grain)
                return grains
            elif count <= 100:
                # Show as a small pile
                pile = Circle(radius=0.3 + np.log10(count) * 0.1, 
                            color=GOLD, 
                            fill_opacity=0.8)
                count_text = Text(f"{int(count)}", font_size=16, color=BLACK)
                count_text.move_to(pile.get_center())
                return VGroup(pile, count_text)
            else:
                # Show as larger pile with size indication
                radius = min(1.5, 0.3 + np.log10(count) * 0.15)
                pile = Circle(radius=radius, 
                            color=GOLD, 
                            fill_opacity=0.9)
                
                # Use scientific notation for large numbers
                if count >= 1e6:
                    count_str = f"{count:.2e}"
                else:
                    count_str = f"{int(count):,}"
                    
                count_text = Text(count_str, font_size=20, color=BLACK)
                count_text.move_to(pile.get_center())
                return VGroup(pile, count_text)
        
        # Animate first few squares individually
        current_grains = 0
        grain_pile = VGroup()
        
        for square_idx in range(1, 17):  # First 16 squares
            # Highlight current square
            row = (square_idx - 1) // 4
            col = (square_idx - 1) % 4
            
            if row < 4 and col < 4:  # Only if square is visible
                current_square = board[row * 4 + col]
                self.play(current_square.animate.set_fill(RED, opacity=0.8), run_time=0.3)
            
            # Calculate grains
            grains_on_square = 2 ** (square_idx - 1)
            current_grains += grains_on_square
            
            # Update displays
            new_grain_count = Text(f"{current_grains:,}", font_size=32, color=YELLOW)
            new_grain_count.move_to(grain_count)
            
            new_square_num = Text(f"{square_idx}", font_size=32, color=BLUE)
            new_square_num.move_to(square_num)
            
            new_power_text = Text(f"2^{square_idx-1} = {grains_on_square:,}", 
                                font_size=28, color=GREEN)
            new_power_text.move_to(power_text)
            
            # Update grain visualization
            new_pile = create_grain_pile(grains_on_square)
            new_pile.next_to(board, RIGHT, buff=1)
            
            # Animate changes
            animations = [
                Transform(grain_count, new_grain_count),
                Transform(square_num, new_square_num),
                Transform(power_text, new_power_text),
            ]
            
            if len(grain_pile) > 0:
                animations.append(Transform(grain_pile, new_pile))
            else:
                grain_pile = new_pile
                animations.append(FadeIn(grain_pile))
            
            self.play(*animations, run_time=0.5 if square_idx < 10 else 0.3)
            
            # Return square to original color
            if row < 4 and col < 4:
                original_color = BLACK if (row + col) % 2 == 0 else WHITE
                self.play(current_square.animate.set_fill(original_color, opacity=0.7), 
                         run_time=0.2)
        
        # Show the exponential explosion
        self.play(FadeOut(board), FadeOut(grain_pile))
        
        explosion_text = Text("The numbers grow EXPONENTIALLY!", 
                            font_size=36, color=RED)
        explosion_text.shift(LEFT * 2)
        self.play(Write(explosion_text))
        self.wait(1)
        
        # Show progression for remaining squares with a graph
        self.play(FadeOut(explosion_text))
        
        # Create exponential graph
        axes = Axes(
            x_range=[0, 64, 8],
            y_range=[0, 20, 5],
            x_length=6,
            y_length=4,
            axis_config={"include_numbers": True},
            tips=False,
        )
        axes.shift(LEFT * 2 + DOWN * 0.5)
        
        x_label = Text("Square Number", font_size=16)
        x_label.next_to(axes.x_axis, DOWN)
        y_label = Text("Power of 10", font_size=16)
        y_label.next_to(axes.y_axis, LEFT).rotate(PI/2)
        
        # Plot exponential growth (log scale)
        def safe_log10(x):
            if x >= 1:
                val = 2**(x-1)
                return np.log10(val) if val > 0 else 0
            return 0
            
        exponential_graph = axes.plot(
            safe_log10,
            x_range=[1, 64],
            color=GOLD,
            stroke_width=3
        )
        
        self.play(
            Create(axes),
            Write(x_label),
            Write(y_label)
        )
        self.play(Create(exponential_graph), run_time=2)
        
        # Highlight specific milestones
        milestones = [
            (20, "Over 1 million grains!", "1,048,576"),
            (30, "Over 1 billion grains!", "1,073,741,824"),
            (40, "Over 1 trillion grains!", "1,099,511,627,776"),
            (64, "Total grains on board:", "18,446,744,073,709,551,615")
        ]
        
        for square, desc, amount in milestones:
            # Create dot on graph
            log_value = np.log10(2**(square-1))
            point = axes.coords_to_point(square, log_value)
            dot = Dot(point, color=RED, radius=0.08)
            
            # Create label
            label = VGroup(
                Text(desc, font_size=20),
                Text(amount, font_size=24, color=YELLOW)
            ).arrange(DOWN, buff=0.1)
            label.next_to(dot, UP, buff=0.2)
            
            self.play(
                GrowFromCenter(dot),
                Write(label),
                run_time=1
            )
            self.wait(0.5)
            
            if square < 64:
                self.play(FadeOut(label), run_time=0.5)
        
        # Final revelation
        self.wait(1)
        final_text = VGroup(
            Text("That's more wheat than has ever existed!", font_size=28, color=RED),
            Text("The power of exponential growth:", font_size=24),
            Text("Small beginnings → Explosive results", font_size=32, color=GOLD)
        ).arrange(DOWN, buff=0.4)
        final_text.to_edge(DOWN)
        
        self.play(Write(final_text))
        self.wait(3)
        
        # End with the moral
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        
        moral = VGroup(
            Text("The king learned a valuable lesson:", font_size=28),
            Text("Never underestimate exponential growth!", font_size=36, color=GOLD),
            Text("2^64 - 1 = 18,446,744,073,709,551,615", font_size=24, color=BLUE)
        ).arrange(DOWN, buff=0.5)
        
        self.play(Write(moral))
        self.wait(3)