from manim import *
import numpy as np

class WheatChessboardDetailed(Scene):
    def construct(self):
        # Title
        title = Text("The Wheat & Chessboard Problem", font_size=48)
        subtitle = Text("A Story of Exponential Growth", font_size=32, color=GOLD)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))

        # Introduce the full chessboard
        intro_text = Text("A chessboard has 64 squares...", font_size=36)
        self.play(Write(intro_text))
        self.wait(1)
        
        # Create full 8x8 chessboard
        square_size = 0.4
        board = VGroup()
        for i in range(8):
            for j in range(8):
                color = GRAY_B if (i + j) % 2 == 0 else GRAY_D
                square = Square(
                    side_length=square_size,
                    fill_color=color,
                    fill_opacity=0.8,
                    stroke_color=WHITE,
                    stroke_width=1
                )
                square.shift(RIGHT * (j - 3.5) * square_size + UP * (i - 3.5) * square_size)
                board.add(square)
        
        self.play(
            FadeOut(intro_text),
            Create(board),
            run_time=2
        )
        self.wait(1)
        
        # Add square numbers to first few squares
        numbers = VGroup()
        for i in range(8):
            num = Text(str(i + 1), font_size=16, color=WHITE)
            num.move_to(board[i].get_center())
            numbers.add(num)
        
        self.play(Write(numbers))
        self.wait(1)
        
        # Setup story
        story = Text("Place 1 grain on square 1, 2 on square 2, 4 on square 3...", 
                    font_size=26)
        story.to_edge(UP)
        self.play(Write(story))
        
        # Move board to left side
        self.play(
            board.animate.scale(0.7).shift(LEFT * 3.5),
            numbers.animate.scale(0.7).shift(LEFT * 3.5),
            FadeOut(story)
        )
        
        # Create display for grain count
        display_group = VGroup()
        
        square_label = Text("Square:", font_size=20)
        square_num = Text("0", font_size=26, color=BLUE)
        square_display = VGroup(square_label, square_num).arrange(RIGHT, buff=0.3)
        
        grains_label = Text("Grains on square:", font_size=20)
        grains_num = Text("0", font_size=26, color=GREEN)
        grains_display = VGroup(grains_label, grains_num).arrange(DOWN, buff=0.1)
        
        total_label = Text("Total grains:", font_size=20)
        total_num = Text("0", font_size=26, color=YELLOW)
        total_display = VGroup(total_label, total_num).arrange(DOWN, buff=0.1)
        
        display_group = VGroup(square_display, grains_display, total_display)
        display_group.arrange(DOWN, buff=0.5)
        display_group.shift(RIGHT * 3.5 + UP * 2)
        
        self.play(Write(display_group))
        
        # Function to create grain visualization
        def create_grain_visual(count, position=ORIGIN):
            grains = VGroup()
            
            if count <= 8:
                # Show individual grains
                for i in range(int(count)):
                    grain = Ellipse(width=0.15, height=0.2, color=GOLD, 
                                  fill_opacity=1, stroke_width=0)
                    # Arrange in a pattern
                    row = i // 3
                    col = i % 3
                    grain.shift(position + RIGHT * (col - 1) * 0.2 + UP * (row - 1) * 0.2)
                    grains.add(grain)
            elif count <= 128:
                # Show as a small pile
                pile = VGroup()
                base = Ellipse(width=1, height=0.5, color=GOLD, fill_opacity=0.9)
                pile.add(base)
                count_text = Text(str(int(count)), font_size=20, color=BLACK)
                count_text.move_to(base.get_center())
                pile.add(count_text)
                pile.shift(position)
                grains = pile
            else:
                # Show as larger visualization with scale
                grains = create_large_visual(count, position)
            
            return grains
        
        def create_large_visual(count, position):
            """Create visualization for large grain counts"""
            visual = VGroup()
            
            if count < 1e6:  # Less than 1 million
                # Show as a bag
                bag = Circle(radius=0.8, color=GOLD, fill_opacity=0.9)
                visual.add(bag)
                
                count_str = f"{int(count):,}"
                label = Text(count_str, font_size=18, color=BLACK)
                label.move_to(bag.get_center())
                visual.add(label)
                
            elif count < 1e9:  # Less than 1 billion (500 million range)
                # Show as multiple carts
                cart = Rectangle(width=1.2, height=0.8, color=GOLD_E, fill_opacity=0.9)
                visual.add(cart)
                
                # Add wheels
                wheel1 = Circle(radius=0.15, color=BLACK, fill_opacity=1)
                wheel1.shift(cart.get_bottom() + LEFT * 0.4 + DOWN * 0.15)
                wheel2 = Circle(radius=0.15, color=BLACK, fill_opacity=1)
                wheel2.shift(cart.get_bottom() + RIGHT * 0.4 + DOWN * 0.15)
                visual.add(wheel1, wheel2)
                
                label = Text(f"{count/1e6:.0f} million", font_size=16, color=BLACK)
                label.move_to(cart.get_center())
                visual.add(label)
                
                desc = Text("(Several large carts!)", font_size=14, color=RED)
                desc.next_to(visual, DOWN)
                visual.add(desc)
                
            elif count < 1e12:  # Less than 1 trillion (500 billion range)
                # Show as a warehouse
                warehouse = Rectangle(width=2, height=1.5, color=GOLD_E, fill_opacity=0.9)
                visual.add(warehouse)
                
                # Add roof
                roof = Polygon(
                    warehouse.get_corner(UL) + LEFT * 0.2,
                    warehouse.get_corner(UR) + RIGHT * 0.2,
                    warehouse.get_top() + UP * 0.5,
                    color=GOLD_D,
                    fill_opacity=0.9
                )
                visual.add(roof)
                
                label = Text(f"{count/1e9:.0f} billion", font_size=16, color=BLACK)
                label.move_to(warehouse.get_center())
                visual.add(label)
                
                desc = Text("(Massive warehouse!)", font_size=14, color=RED)
                desc.next_to(visual, DOWN)
                visual.add(desc)
                
            else:  # Trillion or more
                # Show as a mountain
                mountain = Polygon(
                    LEFT * 1.5 + DOWN * 0.5,
                    RIGHT * 1.5 + DOWN * 0.5,
                    UP * 1.5,
                    color=GOLD,
                    fill_opacity=0.9
                )
                visual.add(mountain)
                
                label = Text(f"{count/1e12:.1f} trillion", font_size=16, color=BLACK)
                label.move_to(mountain.get_center())
                visual.add(label)
                
                desc = Text("(Mountain of wheat!)", font_size=14, color=RED)
                desc.next_to(visual, DOWN)
                visual.add(desc)
            
            visual.shift(position)
            return visual
        
        # Animate first few squares
        total_grains = 0
        grain_visual = VGroup()
        
        # Squares 1-3 with individual grains
        highlight_text = Text("This seems manageable, even trivial!", 
                            font_size=24, color=GREEN)
        highlight_text.shift(DOWN * 2.5)
        
        for square_idx in range(1, 4):
            # Highlight square
            board[square_idx - 1].set_fill(RED, opacity=0.9)
            
            # Calculate grains
            grains_on_square = 2 ** (square_idx - 1)
            total_grains += grains_on_square
            
            # Update displays
            new_square_num = Text(str(square_idx), font_size=26, color=BLUE)
            new_square_num.move_to(square_num.get_center())
            
            new_grains_num = Text(str(grains_on_square), font_size=26, color=GREEN)
            new_grains_num.move_to(grains_num.get_center())
            
            new_total_num = Text(str(total_grains), font_size=26, color=YELLOW)
            new_total_num.move_to(total_num.get_center())
            
            # Create grain visual
            new_grain_visual = create_grain_visual(grains_on_square, RIGHT * 3 + DOWN * 0.5)
            
            self.play(
                Transform(square_num, new_square_num),
                Transform(grains_num, new_grains_num),
                Transform(total_num, new_total_num),
                FadeOut(grain_visual),
                FadeIn(new_grain_visual),
                run_time=1
            )
            grain_visual = new_grain_visual
            
            self.wait(0.5)
            
            # Reset square color
            color = GRAY_B if (square_idx - 1) % 2 == 0 else GRAY_D
            board[square_idx - 1].set_fill(color, opacity=0.8)
        
        self.play(Write(highlight_text))
        self.wait(1)
        self.play(FadeOut(highlight_text))
        
        # Square 8 - still manageable
        square_idx = 8
        board[square_idx - 1].set_fill(RED, opacity=0.9)
        
        grains_on_square = 2 ** (square_idx - 1)
        total_grains = 2 ** square_idx - 1  # Sum formula
        
        new_square_num = Text("8", font_size=26, color=BLUE)
        new_square_num.move_to(square_num.get_center())
        
        new_grains_num = Text("128", font_size=26, color=GREEN)
        new_grains_num.move_to(grains_num.get_center())
        
        new_total_num = Text("255", font_size=26, color=YELLOW)
        new_total_num.move_to(total_num.get_center())
        
        new_grain_visual = create_grain_visual(128, RIGHT * 3 + DOWN * 0.5)
        
        eight_text = Text("By square 8: 128 grains. Still easy to handle!", 
                         font_size=24, color=YELLOW)
        eight_text.shift(DOWN * 2.5)
        
        self.play(
            Transform(square_num, new_square_num),
            Transform(grains_num, new_grains_num),
            Transform(total_num, new_total_num),
            FadeOut(grain_visual),
            FadeIn(new_grain_visual),
            Write(eight_text),
            run_time=1.5
        )
        grain_visual = new_grain_visual
        
        self.wait(1.5)
        self.play(FadeOut(eight_text))
        
        # Reset square 8
        board[7].set_fill(GRAY_D, opacity=0.8)
        
        # Question about square 20
        question = VGroup(
            Text("But what about the 20th square?", font_size=32),
            Text("Take a guess...", font_size=24, color=BLUE)
        ).arrange(DOWN, buff=0.3)
        question.shift(DOWN * 2)
        
        self.play(Write(question[0]))
        self.wait(0.5)
        self.play(Write(question[1]))
        self.wait(2)  # Pause for guess
        self.play(FadeOut(question))
        
        # Square 20 - dramatic reveal
        square_idx = 20
        board[19].set_fill(RED, opacity=0.9)
        
        grains_on_square = 2 ** 19
        total_grains = 2 ** 20 - 1
        
        new_square_num = Text("20", font_size=32, color=BLUE)
        new_square_num.move_to(square_num.get_center())
        
        new_grains_num = Text("524,288", font_size=26, color=GREEN)
        new_grains_num.move_to(grains_num.get_center())
        
        new_total_num = Text("1,048,575", font_size=26, color=YELLOW)
        new_total_num.move_to(total_num.get_center())
        
        # Create dramatic visual for square 20
        new_grain_visual = create_large_visual(grains_on_square, RIGHT * 3 + DOWN * 0.5)
        
        dramatic_text = Text("Over 500,000 grains!", font_size=36, color=RED)
        dramatic_text.shift(DOWN * 2.5)
        
        self.play(
            Transform(square_num, new_square_num),
            Transform(grains_num, new_grains_num),
            Transform(total_num, new_total_num),
            FadeOut(grain_visual),
            GrowFromCenter(new_grain_visual),
            Flash(new_grain_visual, color=YELLOW, line_length=0.3),
            Write(dramatic_text),
            run_time=2
        )
        grain_visual = new_grain_visual
        
        self.wait(2)
        self.play(FadeOut(dramatic_text))
        board[19].set_fill(GRAY_B, opacity=0.8)
        
        # Quick acceleration through 21-30
        accel_text = Text("Accelerating through squares 21-30...", 
                         font_size=24, color=BLUE)
        accel_text.shift(DOWN * 3)
        self.play(Write(accel_text))
        
        for square_idx in [22, 24, 26, 28]:
            board[square_idx - 1].set_fill(RED, opacity=0.9)
            
            grains_on_square = 2 ** (square_idx - 1)
            total_grains = 2 ** square_idx - 1
            
            new_square_num = Text(str(square_idx), font_size=26, color=BLUE)
            new_square_num.move_to(square_num.get_center())
            
            if grains_on_square < 1e6:
                grain_str = f"{grains_on_square:,}"
            else:
                grain_str = f"{grains_on_square/1e6:.1f}M"
            
            new_grains_num = Text(grain_str, font_size=26, color=GREEN)
            new_grains_num.move_to(grains_num.get_center())
            
            if total_grains < 1e6:
                total_str = f"{total_grains:,}"
            else:
                total_str = f"{total_grains/1e6:.1f}M"
                
            new_total_num = Text(total_str, font_size=26, color=YELLOW)
            new_total_num.move_to(total_num.get_center())
            
            self.play(
                Transform(square_num, new_square_num),
                Transform(grains_num, new_grains_num),
                Transform(total_num, new_total_num),
                run_time=0.3
            )
            
            # Reset square color
            row = (square_idx - 1) // 8
            col = (square_idx - 1) % 8
            color = GRAY_B if (row + col) % 2 == 0 else GRAY_D
            board[square_idx - 1].set_fill(color, opacity=0.8)
        
        self.play(FadeOut(accel_text))
        
        # Square 30 - warehouse scale
        square_idx = 30
        board[29].set_fill(RED, opacity=0.9)
        
        grains_on_square = 2 ** 29
        total_grains = 2 ** 30 - 1
        
        new_square_num = Text("30", font_size=26, color=BLUE)
        new_square_num.move_to(square_num.get_center())
        
        new_grains_num = Text("537 million", font_size=22, color=GREEN)
        new_grains_num.move_to(grains_num.get_center())
        
        new_total_num = Text("1.07 billion", font_size=22, color=YELLOW)
        new_total_num.move_to(total_num.get_center())
        
        new_grain_visual = create_large_visual(grains_on_square, RIGHT * 3 + DOWN * 0.5)
        
        warehouse_text = Text("Over 500 million grains—enough to fill a massive warehouse!", 
                            font_size=22, color=RED)
        warehouse_text.shift(DOWN * 2.5)
        
        self.play(
            Transform(square_num, new_square_num),
            Transform(grains_num, new_grains_num),
            Transform(total_num, new_total_num),
            FadeOut(grain_visual),
            GrowFromCenter(new_grain_visual),
            Write(warehouse_text),
            run_time=2
        )
        grain_visual = new_grain_visual
        
        self.wait(2)
        self.play(FadeOut(warehouse_text))
        board[29].set_fill(GRAY_B, opacity=0.8)
        
        # Square 40 - mountain scale
        square_idx = 40
        board[39].set_fill(RED, opacity=0.9)
        
        grains_on_square = 2 ** 39
        total_grains = 2 ** 40 - 1
        
        new_square_num = Text("40", font_size=26, color=BLUE)
        new_square_num.move_to(square_num.get_center())
        
        new_grains_num = Text("550 billion", font_size=22, color=GREEN)
        new_grains_num.move_to(grains_num.get_center())
        
        new_total_num = Text("1.1 trillion", font_size=22, color=YELLOW)
        new_total_num.move_to(total_num.get_center())
        
        new_grain_visual = create_large_visual(grains_on_square, RIGHT * 3 + DOWN * 0.5)
        
        mountain_text = Text("Over 500 billion grains—a mountain of wheat!", 
                           font_size=24, color=RED)
        mountain_text.shift(DOWN * 2.5)
        
        self.play(
            Transform(square_num, new_square_num),
            Transform(grains_num, new_grains_num),
            Transform(total_num, new_total_num),
            FadeOut(grain_visual),
            GrowFromCenter(new_grain_visual),
            Write(mountain_text),
            run_time=2
        )
        grain_visual = new_grain_visual
        
        self.wait(2)
        self.play(FadeOut(mountain_text))
        board[39].set_fill(GRAY_D, opacity=0.8)
        
        # Zoom out to show scale
        self.play(
            board.animate.scale(0.5).shift(UP * 1),
            numbers.animate.scale(0.5).shift(UP * 1),
            display_group.animate.shift(UP * 1),
            grain_visual.animate.shift(UP * 1)
        )
        
        # Show comparison
        comparison_text = VGroup(
            Text("This is exponential growth.", font_size=36, color=GOLD),
            Text("Small at first, deceptively manageable,", font_size=26),
            Text("then shockingly enormous.", font_size=26)
        ).arrange(DOWN, buff=0.3)
        comparison_text.shift(DOWN * 2)
        
        self.play(Write(comparison_text), run_time=2)
        
        # Quick revisit early vs late squares
        self.play(FadeOut(comparison_text))
        
        # Create comparison visual
        early_label = Text("Early squares (1-8):", font_size=24)
        early_visual = VGroup()
        for i in range(8):
            dot = Dot(radius=0.03, color=GOLD)
            dot.shift(RIGHT * i * 0.1)
            early_visual.add(dot)
        early_group = VGroup(early_label, early_visual).arrange(DOWN, buff=0.2)
        early_group.shift(LEFT * 3 + DOWN * 2)
        
        
        self.wait(2)
        
        # Final lesson
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        
        lesson = VGroup(
            Text("The lesson learned:", font_size=32),
            Text("Exponential growth is unintuitive", font_size=40, color=GOLD),
            Text("but profoundly important.", font_size=40, color=GOLD)
        ).arrange(DOWN, buff=0.4)
        
        self.play(Write(lesson))
        self.wait(2)
        
        # Final thought-provoking question
        self.play(FadeOut(lesson))
        
        final_question = VGroup(
            Text("Where else in your life might", font_size=26),
            Text("exponential growth", font_size=36, color=GOLD),
            Text("be quietly at work?", font_size=26)
        ).arrange(DOWN, buff=0.2)
        final_question.shift(UP * 1)
        
        examples = VGroup(
            Text("• Compound interest", font_size=22, color=BLUE),
            Text("• Viral spread", font_size=22, color=GREEN),
            Text("• Technology adoption", font_size=22, color=YELLOW),
            Text("• Population growth", font_size=22, color=RED)
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        examples.shift(DOWN * 1.2)
        
        self.play(Write(final_question))
        self.wait(2)
        self.play(FadeIn(examples))
        self.wait(3)