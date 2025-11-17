from manim import *

class DoublingPower(Scene):
    def construct(self):
        # Title
        title = Text("Potęgowanie Dwójki", font_size=48)
        subtitle = Text("Szokująca natura wzrostu wykładniczego", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create paper (very thin rectangle)
        paper_width = 4
        paper_thickness = 0.05
        paper = Rectangle(
            width=paper_width,
            height=paper_thickness,
            fill_color=WHITE,
            fill_opacity=0.8,
            stroke_color=GRAY
        )
        paper.move_to(ORIGIN)

        # Create counters
        fold_counter = VGroup(
            Text("Złożenia: ", font_size=30),
            Text("0", font_size=30, color=YELLOW)
        ).arrange(RIGHT)
        fold_counter.to_edge(LEFT, buff=1).shift(UP * 2)

        thickness_counter = VGroup(
            Text("Grubość: ", font_size=30),
            Text("1", font_size=30, color=GREEN)
        ).arrange(RIGHT)
        thickness_counter.to_edge(LEFT, buff=1).shift(UP * 1)

        # Show initial state
        self.play(FadeIn(paper), Write(fold_counter), Write(thickness_counter))
        self.wait(1)

        # Function to update counters
        def update_counters(folds, thickness):
            new_fold = Text(str(folds), font_size=30, color=YELLOW)
            new_fold.move_to(fold_counter[1])
            new_thickness = Text(str(thickness), font_size=30, color=GREEN)
            new_thickness.move_to(thickness_counter[1])
            return new_fold, new_thickness

        # First fold
        self.play(paper.animate.set_width(paper_width/2))
        self.play(paper.animate.set_height(paper_thickness * 2))
        new_fold, new_thick = update_counters(1, 2)
        self.play(
            Transform(fold_counter[1], new_fold),
            Transform(thickness_counter[1], new_thick)
        )
        self.wait(0.5)

        # Second fold
        self.play(paper.animate.set_width(paper_width/4))
        self.play(paper.animate.set_height(paper_thickness * 4))
        new_fold, new_thick = update_counters(2, 4)
        self.play(
            Transform(fold_counter[1], new_fold),
            Transform(thickness_counter[1], new_thick)
        )
        self.wait(0.5)

        # Third fold
        self.play(paper.animate.set_width(paper_width/8))
        self.play(paper.animate.set_height(paper_thickness * 8))
        new_fold, new_thick = update_counters(3, 8)
        self.play(
            Transform(fold_counter[1], new_fold),
            Transform(thickness_counter[1], new_thick)
        )
        self.wait(0.5)

        # Speed up message
        speedup_text = Text("Przyspieszamy animację...", font_size=24, color=RED)
        speedup_text.to_edge(DOWN)
        self.play(Write(speedup_text))
        self.wait(0.5)

        # Create visual representation of exponential growth
        # Since we can't literally show paper folding 42 times, we'll show the numbers racing up
        
        # Move paper representation off screen as it gets too thick
        self.play(FadeOut(paper), FadeOut(speedup_text))
        
        # Create a graph showing exponential growth
        axes = Axes(
            x_range=[0, 42, 5],
            y_range=[0, 12, 2],
            x_length=8,
            y_length=5,
            axis_config={"include_tip": True}
        )
        axes.move_to(ORIGIN)
        
        x_label = Text("Złożenia", font_size=24).next_to(axes.x_axis, DOWN)
        y_label = Text("Grubość (skala log)", font_size=24).rotate(PI/2).next_to(axes.y_axis, LEFT)
        
        self.play(Create(axes), Write(x_label), Write(y_label))
        
        # Animate the counting up rapidly
        folds = 3
        thickness = 8
        
        # Create path for exponential curve
        curve_points = []
        for f in range(11):  # Show only first 10 folds for visibility
            point = axes.c2p(f, min(2**f / 100, 12))  # Scale down to fit in graph
            curve_points.append(point)
        
        curve = VMobject()
        curve.set_points_smoothly([curve_points[0], curve_points[1], curve_points[2], curve_points[3]])
        curve.set_color(YELLOW)
        self.play(Create(curve))
        
        # Rapid counting animation
        for i, target_fold in enumerate([5, 7, 10]):
            target_thickness = 2 ** target_fold
            
            # Extend curve
            new_curve = VMobject()
            if target_fold <= 10:
                new_curve.set_points_smoothly(curve_points[:target_fold+1])
            else:
                new_curve.set_points_smoothly(curve_points)
            new_curve.set_color(YELLOW)
            
            # Update counters with scientific notation for large numbers
            if target_thickness > 1000000:
                thick_text = f"{target_thickness:.2e}"
            else:
                thick_text = str(target_thickness)
                
            new_fold, new_thick = Text(str(target_fold), font_size=30, color=YELLOW), Text(thick_text, font_size=30, color=GREEN)
            new_fold.move_to(fold_counter[1])
            new_thick.move_to(thickness_counter[1])
            
            self.play(
                Transform(curve, new_curve),
                Transform(fold_counter[1], new_fold),
                Transform(thickness_counter[1], new_thick),
                run_time=0.5
            )
        
        # Show final fold count at 42
        final_thickness = 2 ** 42
        final_fold = Text("42", font_size=30, color=YELLOW)
        final_thick = Text(f"{final_thickness:.2e}", font_size=30, color=GREEN)
        final_fold.move_to(fold_counter[1])
        final_thick.move_to(thickness_counter[1])
        
        self.play(
            Transform(fold_counter[1], final_fold),
            Transform(thickness_counter[1], final_thick),
            run_time=1
        )
        
        self.wait(1)

        # Final reveal
        self.play(FadeOut(axes), FadeOut(x_label), FadeOut(y_label), FadeOut(curve))
        
        # Moon distance visualization
        moon_distance = 384400  # km
        paper_thickness_km = 0.0001 / 1000  # 0.1mm in km
        final_thickness_km = paper_thickness_km * (2 ** 42)
        
        final_message = VGroup(
            Text("Po 42 złożeniach,", font_size=36),
            Text("stos papieru sięgnąłby Księżyca.", font_size=36, color=YELLOW)
        ).arrange(DOWN, buff=0.3)
        final_message.move_to(ORIGIN)
        
        # Add visual elements
        earth = Circle(radius=0.5, color=BLUE, fill_opacity=0.8)
        earth.to_edge(LEFT, buff=2)
        earth_label = Text("Ziemia", font_size=20).next_to(earth, DOWN)
        
        moon = Circle(radius=0.2, color=GRAY, fill_opacity=0.8)
        moon.to_edge(RIGHT, buff=2)
        moon_label = Text("Księżyc", font_size=20).next_to(moon, DOWN)
        
        # Paper stack visualization
        stack_line = Line(earth.get_right(), moon.get_left(), color=YELLOW, stroke_width=3)
        stack_label = Text(f"{final_thickness_km:.0f} km!", font_size=24, color=YELLOW)
        stack_label.next_to(stack_line, UP)
        
        self.play(
            Write(final_message),
            FadeIn(earth), Write(earth_label),
            FadeIn(moon), Write(moon_label)
        )
        self.play(
            Create(stack_line),
            Write(stack_label)
        )
        
        self.wait(3)